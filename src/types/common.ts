import React from "react";
import { FieldEntity } from "./form-config";
import { Control } from "react-hook-form";

export interface GenericProps {
    style?:React.CSSProperties,
    className?:string,
    children?:React.ReactNode
}

export interface FormFieldProps extends GenericProps {
    field:FieldEntity,
    control:Control
}