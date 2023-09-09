import { Injectable } from "@angular/core";
import { CommonFunctions } from "src/app/util/CommonFunctions";

@Injectable()
export class AuthService {

  modulePolicyApproved(module: number, frame: number) 
  {
    let status = false;
    if (CommonFunctions.userPolicy != undefined && CommonFunctions.userPolicy != null) {
      let filterPolicy: any[] = CommonFunctions.userPolicy
        .filter(policy => policy.id === module || policy.id === frame || policy.id === 1);
      if (filterPolicy.length > 0) (status = true)
    }
    return status;
  }
}