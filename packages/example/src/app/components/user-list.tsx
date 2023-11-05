import { StateModel } from "../store";
import type { DeepSignal } from 'deepsignal';

export const UserList = ({ $state }: { $state: DeepSignal<StateModel> }) => {

    return <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Name
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Gender
                </th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {$state.$users?.value.filter($state.filter).length === 0 ?? (
                <div>No results</div>
            )}
            {$state.$users?.value.filter($state.filter).map((user) => (
                <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.picture.thumbnail}
                                    alt=""
                                />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.name.first} {user.name.last}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                            {user.gender}{' '}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
}