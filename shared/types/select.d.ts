export type FormSelectPreset = { name: string; list: Array<string | number> };

export type FormSelectPresetGroup = { name?: string; presets: FormSelectPreset[] };

export type FormSelectPresets = (FormSelectPreset | FormSelectPresetGroup)[];
