import { BackendErrorModel } from '../../shared/models/backend-error.model';

export interface AuthStateModel {
  isAuthenticate: boolean;
  username: string | null;
  error?: BackendErrorModel;
}
