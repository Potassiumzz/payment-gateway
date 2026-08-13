export interface ValidatePinPayload {
	pin: string;
	accountNumber: number;
}

export interface ValidatePinResponse {
	responseCode: number;
	responseMsg: string;
}
