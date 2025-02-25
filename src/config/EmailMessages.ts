export const pendingAgentMessage = {
  subject: "Agent’s Registration De-Active ",
  body: `<div>
      <h3>Dear Agent (agent name dynamic):</h3>
      <p>Unfortunately due to lack of transactions / Outstanding / Non Responsive your account has been De-Active.</p>
      <p>Kindly call our Admin team to reconcile and settle your account.</p>
      <p>Thanks, and regards.</p>
      <p>Team (Admin company name)</p>
      <p>Address</p>
      <p>Email</p>
     <p> Contact number</p>
      </div>`,
};

// WHEN AGENCY IS created
export const registerAgencyMsg = (
  agent_name: string,
  email: string | undefined,
  agency: string | undefined,
  mobile_no: string | undefined,
  address: string | undefined
) => {
  return `
  <div>
      <p>Dear Agent (${agent_name}),</p>
      <p>Thank you for your trust to do bussiness with ${agency}.</p>
      <p>We did receive your registration request once our management check and activate your account.You will receive the confirmation email shortly.</p>
      <p>Thanks, and regards.</p><br>
      Team (${agency})</p>
  </div>`;
};

// when agency in registered
export const ActivatePendingAgencyMsg = (
  agent_name: string,
  email: string | undefined,
  agency: string | undefined,
  mobile_no: string | undefined,
  address: string | undefined,
  comp_email: string | undefined
) => {
  return `<div>
    <p>Dear Agent (${agent_name}),</p>
    <p>We are pleased to inform you that your registration is confirmed with us.</p>
    <p>You may please visit our website (<a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a>) and log in to your account with your email ID (${comp_email}).</p>
    <p>Your password is the same as the one you provided at the time of registration or you may try with Forget Password.</p>
    <p>Thanks, and regards.</p><br>
    
    <p style="margin-top: 20px;">Team (${agency})</p>
  </div>`;
};

// WHEN AGENCY IS REGISTERED
export const rejectPendingAgencyMsg = (
  agent_name: string,
  email: string | undefined,
  agency: string | undefined,
  mobile_no: string | undefined,
  address: string | undefined
) => {
  return `<div>
    <p>Agent’s Registration Declined (${agent_name}):</p>
    <p>Unfortunately, due to some technical issues or some market inelegances are declining your registration. Further you may call our admin department for any clarifications.</p>
    <p>Kindly call our Admin team to reconcile and settle your account.</p>
    <p>Thanks, and regards.</p><br>
    <p>Team (${agency})</p>
    </div>`;
};

// when agency is de activated
// export const deActivateAgencyMsg=(agent_name:string,email:string| undefined,agency:string | undefined,mobile_no:string| undefined,address:string| undefined)=>{
//     return `<div>
//     <h3>Dear Agent ${agent_name}:</h3>
//     <p>Unfortunately due to lack of transactions / Outstanding / Non Responsive your account has been De-Activated.</p>
//     <p>Kindly call our Admin team to reconcile and settle your account.</p>
//     <p>Thanks, and regards.</p>
//     <p>Team ${agency}</p>
//     <p>${address}</p>
//     <p>${email}</p>
//    <p>${mobile_no}</p>
//     </div>`
// }

export const deActivateAgencyMsg = (
  agent_name: string,
  email: string | undefined,
  agency: string | undefined,
  mobile_no: string | undefined,
  address: string | undefined
) => {
  return `
      <div>
        <h3>Agent’s Registration Declined (${agent_name}):</h3>
        <p>Dear Agent ${agent_name},</p>
        <p>Unfortunately, due to some technical issues or some market inelegances, we are declining your registration. Further, you may call our admin department for any clarifications.</p>
        <p>Kindly call our Admin team to reconcile and settle your account.</p>
        <p>Thanks, and regards,</p>
        <p>Team (${agency})</p>
      </div>
    `; 
};

export const NewPaymentDepositRequestMsg = (agent_name: string, team: string | undefined, agency: string | undefined, mobile_no: string | undefined, address: string | undefined, amount: number | undefined, currency: string | undefined) => {
  return `<div>
    <p>Dear ${agent_name},</p>
    <br>
    <p>We have received your new payment deposit request of amount ${currency} ${amount}.</p>
    <p>Kindly wait for the update from our finance department. Once your payment is successful, you will receive a confirmation and the amount will be updated in your ledger.</p>
    <br>
    <p>Feel free to call our support for any further assistance.</p>
    <br>
    <p>Thanks, and regards,</p>
    <br>
    <p>Team ${team}</p>
  </div>`;
};

export const NewPaymentDepositConfirmMsg = (agent_name: string, team: string | undefined, agency: string | undefined, mobile_no: string | undefined, address: string | undefined, amount: number | undefined, currency: string | undefined) => {
  return `<div>
    <p>Dear ${agent_name},</p>
    <br>
    <p>We are confirming that your amount ${currency} ${amount} is confirmed and updated in your ledger.</p>
    <br>
    <p>Feel free to call our support for any further assistance.</p>
    <br>
    <p>Thanks, and regards,</p>
    <br>
    <p>Team ${team}</p>
  </div>`;
};
