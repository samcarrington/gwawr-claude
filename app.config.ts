export default defineAppConfig({
  ui: {
    button: {
      // Override UButton default styling to use our design system
      base: 'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium transition-all duration-200',
      font: 'font-medium',
      rounded: 'rounded-lg',
      size: {
        xs: 'text-xs px-2 py-1',
        sm: 'text-sm px-3 py-2',
        md: 'text-sm px-4 py-3',
        lg: 'text-base px-6 py-3',
        xl: 'text-lg px-8 py-4',
      },
      gap: {
        xs: 'gap-1',
        sm: 'gap-1.5',
        md: 'gap-2',
        lg: 'gap-2.5',
        xl: 'gap-3',
      },
      padding: {
        xs: 'px-2 py-1',
        sm: 'px-3 py-2',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
        xl: 'px-8 py-4',
      },
      square: {
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-3',
        lg: 'p-4',
        xl: 'p-5',
      },
      color: {
        primary: {
          solid:
            'shadow-sm ring-1 ring-inset ring-primary/20 text-white bg-primary hover:bg-primary-600 disabled:bg-primary disabled:hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          outline:
            'shadow-sm ring-1 ring-inset ring-primary text-primary bg-transparent hover:bg-primary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          soft: 'text-primary bg-primary/10 hover:bg-primary/20 disabled:bg-primary/10 disabled:hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          ghost:
            'text-primary bg-transparent hover:bg-primary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          link: 'text-primary hover:text-primary-600 disabled:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        },
        secondary: {
          solid:
            'shadow-sm ring-1 ring-inset ring-secondary/20 text-white bg-secondary hover:bg-secondary-600 disabled:bg-secondary disabled:hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          outline:
            'shadow-sm ring-1 ring-inset ring-secondary text-secondary bg-transparent hover:bg-secondary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          soft: 'text-secondary bg-secondary/10 hover:bg-secondary/20 disabled:bg-secondary/10 disabled:hover:bg-secondary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          ghost:
            'text-secondary bg-transparent hover:bg-secondary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          link: 'text-secondary hover:text-secondary-600 disabled:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        },
        info: {
          solid:
            'shadow-sm ring-1 ring-inset ring-tertiary/20 text-white bg-tertiary hover:bg-tertiary-600 disabled:bg-tertiary disabled:hover:bg-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
          outline:
            'shadow-sm ring-1 ring-inset ring-tertiary text-tertiary bg-transparent hover:bg-tertiary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
          soft: 'text-tertiary bg-tertiary/10 hover:bg-tertiary/20 disabled:bg-tertiary/10 disabled:hover:bg-tertiary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
          ghost:
            'text-tertiary bg-transparent hover:bg-tertiary/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
          link: 'text-tertiary hover:text-tertiary-600 disabled:text-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
        },
        success: {
          solid:
            'shadow-sm ring-1 ring-inset ring-success/20 text-white bg-success hover:bg-success-600 disabled:bg-success disabled:hover:bg-success focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success',
          outline:
            'shadow-sm ring-1 ring-inset ring-success text-success bg-transparent hover:bg-success/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success',
          soft: 'text-success bg-success/10 hover:bg-success/20 disabled:bg-success/10 disabled:hover:bg-success/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success',
          ghost:
            'text-success bg-transparent hover:bg-success/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success',
          link: 'text-success hover:text-success-600 disabled:text-success focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success',
        },
        warning: {
          solid:
            'shadow-sm ring-1 ring-inset ring-warning/20 text-white bg-warning hover:bg-warning-600 disabled:bg-warning disabled:hover:bg-warning focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning',
          outline:
            'shadow-sm ring-1 ring-inset ring-warning text-warning bg-transparent hover:bg-warning/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning',
          soft: 'text-warning bg-warning/10 hover:bg-warning/20 disabled:bg-warning/10 disabled:hover:bg-warning/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning',
          ghost:
            'text-warning bg-transparent hover:bg-warning/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning',
          link: 'text-warning hover:text-warning-600 disabled:text-warning focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning',
        },
        error: {
          solid:
            'shadow-sm ring-1 ring-inset ring-error/20 text-white bg-error hover:bg-error-600 disabled:bg-error disabled:hover:bg-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error',
          outline:
            'shadow-sm ring-1 ring-inset ring-error text-error bg-transparent hover:bg-error/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error',
          soft: 'text-error bg-error/10 hover:bg-error/20 disabled:bg-error/10 disabled:hover:bg-error/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error',
          ghost:
            'text-error bg-transparent hover:bg-error/10 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error',
          link: 'text-error hover:text-error-600 disabled:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error',
        },
        gray: {
          solid:
            'shadow-sm ring-1 ring-inset ring-neutral-300 text-white bg-neutral-700 hover:bg-neutral-800 disabled:bg-neutral-700 disabled:hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
          outline:
            'shadow-sm ring-1 ring-inset ring-neutral-300 text-neutral-700 bg-transparent hover:bg-neutral-100 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
          soft: 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-100 disabled:hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
          ghost:
            'text-neutral-700 bg-transparent hover:bg-neutral-100 disabled:bg-transparent disabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
          link: 'text-neutral-700 hover:text-neutral-900 disabled:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
        },
      },
      variant: {
        solid: 'shadow-sm text-white',
        outline: 'ring-1 ring-inset bg-transparent',
        soft: '',
        ghost: 'bg-transparent',
        link: 'ring-0 shadow-none underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2',
      },
      icon: {
        base: 'flex-shrink-0',
        loading: 'animate-spin',
        size: {
          xs: 'size-4',
          sm: 'size-4',
          md: 'size-5',
          lg: 'size-5',
          xl: 'size-6',
        },
      },
      default: {
        size: 'md',
        variant: 'solid',
        color: 'primary',
        loadingIcon: 'i-heroicons-arrow-path-20-solid',
      },
    },
  },
});
