import { ApiResponse, User } from './model';
import { ActionType, StateContextType } from 'signals-store';

export type genderType = 'none' | 'female' | 'male' | 'other';
export interface StateModel {
  loading: boolean;
  users: User[];
  genderFilter: genderType;
  filter: (user: User) => boolean;
}
export const initialState: StateModel = {
  loading: true,
  users: [],
  genderFilter: 'none',
  filter: (u) => true,
};

export class LoadAction implements ActionType<StateModel, never> {
  type = 'LOAD';
  async execute(ctx: StateContextType<StateModel>): Promise<StateModel> {
    const currentState = ctx.getState();
    if (currentState.users.length === 0) {
      ctx.patchState({ loading: true }); //
      const users = (
        (await (
          await fetch('https://randomuser.me/api/?results=20')
        ).json()) as ApiResponse
      ).results; //axios.get<ApiResponse>('https://randomuser.me/api/?results=20')).data.results;
      return ctx.patchState({ loading: false, users });
    }
    return currentState;
  }
}

export class FilterAction
  implements ActionType<StateModel, { gender: genderType }>
{
  type = 'FILTER';

  constructor(public payload: { gender: genderType }) {}

  async execute(ctx: StateContextType<StateModel>): Promise<StateModel> {
    await ctx.dispatch(new ClearFilterAction());
    return ctx.patchState({
      genderFilter: this.payload.gender,
      filter: (u: User) => u?.gender === this.payload.gender,
    });
  }
}

export class ClearFilterAction implements ActionType<StateModel, never> {
  type = 'FILTER_CLEAR';

  async execute(ctx: StateContextType<StateModel>): Promise<StateModel> {
    return ctx.patchState({
      genderFilter: initialState.genderFilter,
      filter: initialState.filter,
    });
  }
}
