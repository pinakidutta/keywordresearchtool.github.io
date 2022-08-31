module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./Layouts/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      colors:{
        'primary-color': 'var(--color-primary)',
        // title 
        'title-color': 'var(--color-title)',
        'title-color-muted': 'var(--color-title-muted)',
        // sidebar
        'color-sidebar-head': 'var(--color-sidebar-head)',
        'color-sidebar-item-hover': 'var(--color-sidebar-item-hover)',
        // border
        'border-color-light': 'var(--color-border-light)',
        // status
        'color-danger': 'var(--color-danger)',
        // dashboard
        'color-dashboard-bg': '#F7F8FA',
        // textprimary
         'text-primary-color': '#313B5E',
         // table head background
          'table-head-bg': '#F7F7F8',
      }
    },
 
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/typography'),

  ],
}

