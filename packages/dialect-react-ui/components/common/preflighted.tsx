import clsx from 'clsx';
import React from 'react';

export const A = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { className?: string }) => {
  return <a className={clsx('dt-a', className)} {...props} />;
};

export const P = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'> & { className?: string }) => {
  return <p className={clsx('dt-text', className)} {...props} />;
};

export const H1 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h1'> & { className?: string }) => {
  return <h1 className={clsx('dt-text', className)} {...props} />;
};

export const H2 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h2'> & { className?: string }) => {
  return <h2 className={clsx('dt-text', className)} {...props} />;
};

export const H3 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h3'> & { className?: string }) => {
  return <h3 className={clsx('dt-text', className)} {...props} />;
};

export const H4 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h4'> & { className?: string }) => {
  return <h4 className={clsx('dt-text', className)} {...props} />;
};

export const H5 = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h5'> & { className?: string }) => {
  return <h5 className={clsx('dt-text', className)} {...props} />;
};

export const Input = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & { className?: string }) => {
  return <input className={clsx('dt-text', className)} {...props} />;
};

export const Textarea = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & { className?: string }) => {
  return <textarea className={clsx('dt-textarea', className)} {...props} />;
};

export const Img = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'img'> & { className?: string }) => {
  return <img className={clsx('dt-img', className)} {...props} />;
};

export const Label = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'label'> & { className?: string }) => {
  return <label className={clsx('dt-label', className)} {...props} />;
};

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  className?: string;
};

export const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx('dt-button', className)} {...props} />
    );
  }
);
ButtonBase.displayName = 'ButtonBase';
