import { $state, store } from '../context';
import { UserList } from '../components/user-list';
import { ActionButtons } from '../components/action-buttons';
import { useComputed } from '@preact/signals-react';

export function UserPage() {
    const count$ = useComputed(() => $state.$users?.value.filter($state.filter).length ?? 0);

    if ($state.$loading.value) {
        return <div>Loading..</div>
    }
    return <div>
        <div className="flex">
            <ActionButtons $state={$state} store={store}></ActionButtons>
        </div>
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <h2 className='ml-10 m-4'>User count: {count$.value}</h2>
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <UserList $state={$state}></UserList>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default UserPage;
