// todo: think about conditional gradients
export type ThemeClasses = {
  text: {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
  };
  // all input types: buttons, checkboxes, switches, text fields, etc.
  input: {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      // switches, checkboxes
      checked: string;
      unchecked: string;
    };
  };
  // non-input borders
  stroke: {
    colors: {
      primary: string;
    };
  };
  icon: {
    colors: {
      primary: string;
      secondary: string;
      inverse: string;
    };
  };
  accent: {
    colors: {
      // todo: think about transparency
      brand: string;
      success: string;
      warning: string;
      error: string;
    };
  };
};
