const typography = {
  fontFamily:
    '"Inter","Segoe UI",Roboto,Helvetica,Arial,sans-serif',

  h1: {
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },

  h2: {
    fontSize: "1.5rem",
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  h3: {
    fontSize: "1.25rem",
    lineHeight: 1.3,
    fontWeight: 700,
    letterSpacing: "-0.015em",
  },

  h4: {
    fontSize: "1.1rem",
    lineHeight: 1.35,
    fontWeight: 700,
  },

  h5: {
    fontSize: "1rem",
    lineHeight: 1.4,
    fontWeight: 700,
  },

  h6: {
    fontSize: "0.9rem",
    lineHeight: 1.4,
    fontWeight: 700,
  },

  body1: {
    fontSize: "0.875rem",
    lineHeight: 1.6,
    fontWeight: 400,
  },

  body2: {
    fontSize: "0.8125rem",
    lineHeight: 1.55,
    fontWeight: 400,
  },

  button: {
    textTransform: "none" as const,
    fontWeight: 600,
    letterSpacing: "0.005em",
  },

  caption: {
    fontSize: "0.6875rem",
    lineHeight: 1.45,
    fontWeight: 500,
  },

  overline: {
    fontSize: "0.625rem",
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
  },

  navigation: {
    fontSize: "0.75rem",
    lineHeight: 1.3,
    fontWeight: 600,
  },

  navigationSmall: {
    fontSize: "0.6875rem",
    lineHeight: 1.3,
    fontWeight: 500,
  },

  metric: {
    fontSize: "1.5rem",
    lineHeight: 1.15,
    fontWeight: 750,
    letterSpacing: "-0.025em",
  },
};

export default typography;