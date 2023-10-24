import { DocumentData, DocumentReference, setDoc } from "firebase/firestore";

export class SetDocQueue {
    private queue: { doc: DocumentReference; data: unknown }[] = [];
    private currentDocId: string | null = null;
    private timeoutId: ReturnType<typeof setTimeout> | null = null;
  
    constructor(private delay: number) {}
  
    enqueue(doc: DocumentReference<DocumentData>, data: unknown) {
      this.queue.push({ doc, data });
      this.processQueue();
    }
  
    private async processQueue() {
      if (this.currentDocId !== null) {
        const currentDoc = this.queue.find((item) => item.doc.id === this.currentDocId);
        if (currentDoc) {
          // If there is a current doc with the same id, remove it from the queue
          this.queue = this.queue.filter((item) => item.doc.id !== this.currentDocId);
        } else {
          // If there is no current doc with the same id, execute the current doc
          const { doc, data } = this.queue.shift()!;
          this.currentDocId = doc.id;
          await setDoc(doc, data);
          this.currentDocId = null;
        }
      } else if (this.queue.length > 0) {
        // If there is no current doc, execute the next doc in the queue
        const { doc, data } = this.queue.shift()!;
        this.currentDocId = doc.id;
        await setDoc(doc, data);
        this.currentDocId = null;
      }
  
      if (this.queue.length > 0) {
        // If there are still docs in the queue, schedule the next execution
        this.timeoutId = setTimeout(() => {
          this.processQueue();
        }, this.delay);
      } else {
        // If there are no more docs in the queue, clear the timeout
        this.timeoutId = null;
      }
    }
  
    cancel() {
      this.queue = [];
      this.currentDocId = null;
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }