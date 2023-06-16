/*
  Format response message.
  Example return format: [{"msg": "message one"}, {"msg": "message two"}]
*/
interface ResponseMessageRes {
  msg: string;
  param?: string;
}

export default async function responseMessage(
  message:
    | string
    | { msg: string; param?: string }
    | { msg: string; param?: string }[]
): Promise<ResponseMessageRes[]> {
  let messages: { msg: string; param?: string }[] = [{ msg: "" }];

  if (typeof message === "string" || message instanceof String) {
    messages = [{ msg: message as string }];
  } else if (Array.isArray(message)) {
    messages = message as { msg: string; param?: string }[];
  } else if (typeof message === "object" && message !== null) {
    messages = [message as { msg: string; param?: string }];
  }

  return messages;
}
