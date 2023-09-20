import Style from "./styles/Loading.module.css";

export default function Loading({ message }: { message: string | null }) {
  return (
    <>
      <div className={Style.wrapper}>
        {message && <h2>{message}</h2>}
        <div className={Style.load}> </div>
      </div>
    </>
  );
}
