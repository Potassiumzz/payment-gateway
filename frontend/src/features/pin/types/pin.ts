export interface ValidatePinPayload {
	pin: string;
	account_number: number;
}

export interface ValidatePinResponse {
	response_code: number;
	response_msg: string;
}
