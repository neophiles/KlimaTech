import Action from "./info/Action";
import Cause from "./info/Cause";
import Data from "./info/Data";
import Illnesses from "./info/Illnesses";
import Vulnerable from "./info/Vulnerable";

function Info() {
  return (
    <>
      <Data />
      <Cause />
      <Illnesses />
      <Vulnerable />
      <Action />
    </>
  )
}

export default Info;