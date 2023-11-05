import { Store } from "signals-store";
import { ClearFilterAction, FilterAction, StateModel } from "../store";
import type { DeepSignal } from 'deepsignal';

export const ActionButtons = ({ $state, store }: { $state: DeepSignal<StateModel>, store: Store<StateModel> }) => {
    const normal =
        'm-2 bg-transparent h!over:bg-blue-500 text-bg-blue-500 py-2 px-4 border border-blue-500 hover:border-blue-800 rounded';
    const active =
        'm-2 cursor-default bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

    return <>
        <button
            onClick={() => store.dispatch(new FilterAction({ gender: 'female' }))}
            disabled={$state.$genderFilter.value === 'female'}
            className={$state.$genderFilter.value === 'female' ? active : normal}
        >
            Female
        </button>
        <button
            onClick={() => store.dispatch(new FilterAction({ gender: 'male' }))}
            disabled={$state.$genderFilter.value === 'male'}
            className={$state.$genderFilter.value === 'male' ? active : normal}
        >
            Male
        </button>
        <button
            onClick={() => store.dispatch(new FilterAction({ gender: 'other' }))}
            disabled={$state.$genderFilter.value === 'other'}
            className={$state.$genderFilter.value === 'other' ? active : normal}
        >
            Other
        </button>
        <button
            onClick={() => store.dispatch(new ClearFilterAction())}
            disabled={!$state.$genderFilter.value}
            className={$state.$genderFilter.value === 'none' ? active : normal}
        >
            Unfiltered
        </button>
    </>
}