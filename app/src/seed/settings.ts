export type SettingsDTO = {
  registrationOpen: boolean;
  noRegistrationMessage?: string;
};

export const settingsSeed: SettingsDTO = {
  registrationOpen: true,
  noRegistrationMessage: "Registration is currently open.",
};


