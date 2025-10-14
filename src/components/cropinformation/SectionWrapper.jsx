import React from 'react';
import { ChevronDown } from "lucide-react";

const SectionWrapper = ({ title, isOpen, onToggle, children }) => {
    if (!children) return null;
    
    return (
        <section className="bg-white rounded-xl p-4 shadow-sm">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={onToggle}
            >
                <h2 className="text-[#075A53] font-semibold text-[14px]">{title}</h2>
                <ChevronDown
                    size={16}
                    className={`text-emerald-800 transform transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
            </div>
            {isOpen && <div className="mt-3">{children}</div>}
        </section>
    );
};

export default SectionWrapper;