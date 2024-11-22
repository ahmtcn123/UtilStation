import { HeartIcon, InformationCircleIcon } from "@heroicons/react/16/solid";
import BreadCrumbProvider from "./BreadCrumbProvider";
import { useState } from "react";
import clsx from "clsx";
import { Tool } from "./Header";
import { switchStateByCallback } from "~/utils/CommonCodeGenerators";



export type ToolbarProps = Tool;

export default function Toolbar(props: ToolbarProps) {
    const infoModalState = useState(false);
    const notMobileSupportedState = useState(!props.mobileSupported);

    const infoModalStyle = clsx("modal modal-bottom sm:modal-middle", {
        "modal-open": infoModalState[0],
    });

    const notMobileSupportedModalStyle = clsx("modal modal-bottom sm:modal-middle", {
        "modal-open": notMobileSupportedState[0],
    });

    return (
        <div className="bg-base-100 border-b border-currentColor mt-2 sticky top-[17px] z-[98]">
            <div className="flex items-center justify-between px-4">
                <div className="indicator">
                    <span className="indicator-item badge badge-secondary">v{props.version}</span>
                    <h1 className="text-lg font-bold">{props.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button aria-label="About Tool Button" className="btn btn-outline btn-square btn-primary h-6" onClick={switchStateByCallback(infoModalState)}>
                        <InformationCircleIcon className="h-6" />
                    </button>
                    <div className="tooltip tooltip-left" data-tip="Soon">
                        <button aria-label="Add Tool To Favorites Button" className="btn btn-outline btn-square btn-secondary h-6">
                            <HeartIcon className="h-6" />
                        </button>
                    </div>
                </div>
            </div>
            <BreadCrumbProvider />
            {/* Modals */}
            <>
                <dialog className={infoModalStyle}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{props.name}</h3>
                        <p className="py-4">
                            {props.description}
                        </p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button aria-label="Close Info Modal Button" className="btn" onClick={switchStateByCallback(infoModalState)}>Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <dialog className={notMobileSupportedModalStyle}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Warning</h3>
                        <p className="py-4">
                            This tool is not supported on mobile devices, please use a desktop device for better experience.
                        </p>
                        <div className="modal-action">
                            <form method="dialog">
                                <button aria-label="Confirm Warning Button" className="btn" onClick={switchStateByCallback(notMobileSupportedState)}>Ok</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </>
        </div>
    );
}