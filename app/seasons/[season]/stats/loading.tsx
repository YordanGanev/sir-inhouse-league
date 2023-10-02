import Loading from "@/components/loading";
import Style from "./loading.module.css";

export default function loading() {
  return (
    <>
      <div className={Style.info}>Loading Matches data..</div>
      <div className={Style.wrapper}>
        <Loading message={null} />
      </div>
    </>
  );
}
