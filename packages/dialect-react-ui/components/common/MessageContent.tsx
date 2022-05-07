import LinkifiedText from "./LinkifiedText";
// import type { Message } from '@dialectlabs/web3';
import { } from '@solana/pay';

type PropsType = {
  message: any;
}

export default function MessageContent(props: PropsType) {
  const t = "Please 🥺 solana:asdfasdfasd?message=this%20is%20cool&amount=99".match(/(solana:\S+)/);

  console.log('text', t);
  // const isSolanaPay = new URL([0])
  return (<LinkifiedText>{props.message.text}</LinkifiedText>)
}
