export class ApiResponse {
  public success = true;

  constructor(public data: any) {}

  static of(data: any) {
    return new ApiResponse(data);
  }
}
