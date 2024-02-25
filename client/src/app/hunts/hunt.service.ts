

@Injectable({
  providedIn: `root`
})
export class HuntService {
  // The URL for the hunts part of the server API.
  readonly huntUrl: string = `${environment.apiUrl}hunts`;

  private readonly huntKey = 'name';
