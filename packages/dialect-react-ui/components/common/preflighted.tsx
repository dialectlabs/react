import React, { ButtonHTMLAttributes } from 'react';
import cs from '../../utils/classNames';

export const A = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { className?: string }) => {
  return <a className={cs('dt-a', className)} {...props} />;
};

export const P = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'> & { className?: string }) => {
  return <p className={cs('dt-text', className)} {...props} />;
};

export const H1 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h1'> & { className?: string }) => {
  return <h1 className={cs('dt-text', className)} {...props} />;
};

export const H2 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h2'> & { className?: string }) => {
  return <h2 className={cs('dt-text', className)} {...props} />;
};

export const H3 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h3'> & { className?: string }) => {
  return <h3 className={cs('dt-text', className)} {...props} />;
};

export const H4 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h4'> & { className?: string }) => {
  return <h4 className={cs('dt-text', className)} {...props} />;
};

export const H5 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h5'> & { className?: string }) => {
  return <h5 className={cs('dt-text', className)} {...props} />;
};

export const Input = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & { className?: string }) => {
  return <input className={cs('dt-text', className)} {...props} />;
};

export const Textarea = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & { className?: string }) => {
  return <textarea className={cs('dt-textarea', className)} {...props} />;
};

export const Img = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'img'> & { className?: string }) => {
  return <img className={cs('dt-img', className)} {...props} />;
};

export const Label = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'label'> & { className?: string }) => {
  return <label className={cs('dt-label', className)} {...props} />;
};

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  className?: string;
};

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button ref={ref} className={cs('dt-button', className)} {...props} />
    );
  }
);
ButtonBase.displayName = 'ButtonBase';
