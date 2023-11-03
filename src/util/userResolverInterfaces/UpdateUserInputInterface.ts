export interface IUpdateUserInput {
  id: string;
  updatedUserFields: {
    username: string;
    password: string;
    email: string;
  };
}
