import React from "react";
import { Construction, Loader2 } from "lucide-react";
import CropgenBotHeader from "../components/cropgenbot/CropgenBotHeader";

export default function CropgenBot() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F8F8F8]/50">
            <CropgenBotHeader />

            <div className="flex flex-col gap-4 items-center justify-center flex-1 p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-10 h-10 text-[#075A53] animate-spin" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Work in Progress
                    </h2>
                </div>
                <p className="text-gray-500 text-base md:text-lg">
                    Our <span className="font-semibold text-[#075A53]">CropgenBot 🤖</span>{" "}
                    feature is under development.
                </p>
            </div>
        </div>
    );
}
