import { ReactSVG } from "react-svg";

export type UndrawProps = {
    className?: string;
    src: string;
    width?: string | number;
    height?: string | number;
} & { [key: string]: string | number | undefined };


export default function Undraw({ className, src, ...props }: UndrawProps) {
    return (
        <ReactSVG
            src={src}
            width={props.width}
            height={props.height}
            beforeInjection={(svg) => {
                if (className) {
                    svg.classList.add(className);
                }

                Object.keys(props).forEach((key) => {
                    const value = props[key];
                    if (value !== undefined && value !== null) {
                        svg.setAttribute(key, value as string);
                    }
                });
            }}
        />
    );
}
