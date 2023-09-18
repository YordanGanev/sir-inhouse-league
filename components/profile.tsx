import Image from "next/image";
import Style from "./styles/Profile.module.css";

export default function Profile({
  picture,
  title,
  subtitle,
  description,
  responsive,
}: {
  picture: string;
  title: string;
  subtitle: string;
  description?: string;
  responsive?: boolean;
}) {
  return (
    <div className={Style.wrapper}>
      <div>
        <Image
          className={Style.image}
          src={picture}
          alt={`${title}-img`}
          width={96}
          height={96}
        />
      </div>
      <div className={Style.content}>
        <h2>{title}</h2>
        <p className={Style.subtitle}>{subtitle}</p>
        {description && (
          <div
            className={`${Style.description} ${
              responsive ? Style.responsive : ""
            }`}
          >
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
