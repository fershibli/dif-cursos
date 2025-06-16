import { Request } from "express";
import { ITokenPayload } from "./tokenPayload.interface";

export interface AuthenticatedRequest extends Request {
  usuario?: ITokenPayload["usuario"];
}
