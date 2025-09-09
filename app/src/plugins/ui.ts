import type { App } from "vue";

// Atoms
import UiButton from "../components/ui/atoms/UiButton.vue";
import UiInput from "../components/ui/atoms/UiInput.vue";
import UiSelect from "../components/ui/atoms/UiSelect.vue";
import UiLabel from "../components/ui/atoms/UiLabel.vue";
import UiBadge from "../components/ui/atoms/UiBadge.vue";
import UiTextarea from "../components/ui/atoms/UiTextarea.vue";
import UiCheckbox from "../components/ui/atoms/UiCheckbox.vue";
import UiFileButton from "../components/ui/atoms/UiFileButton.vue";
import UiAvatar from "../components/ui/atoms/UiAvatar.vue";

// Molecules
import UiFormField from "../components/ui/molecules/UiFormField.vue";
import UiEmptyState from "../components/ui/molecules/UiEmptyState.vue";
import UiModal from "../components/ui/molecules/UiModal.vue";
import UiDrawer from "../components/ui/molecules/UiDrawer.vue";
import UiToolbar from "../components/ui/molecules/UiToolbar.vue";
import UiTabs from "../components/ui/molecules/UiTabs.vue";

// Organisms
import AppHeader from "../components/ui/organisms/AppHeader.vue";
import UiDataTable from "../components/ui/organisms/UiDataTable.vue";
import RegistrationTimeline from "../components/ui/organisms/RegistrationTimeline.vue";

export default {
  install(app: App) {
    // Atoms
    app.component("UiButton", UiButton);
    app.component("UiInput", UiInput);
    app.component("UiSelect", UiSelect);
    app.component("UiLabel", UiLabel);
    app.component("UiBadge", UiBadge);
    app.component("UiTextarea", UiTextarea);
    app.component("UiCheckbox", UiCheckbox);
    app.component("UiFileButton", UiFileButton);
    app.component("UiAvatar", UiAvatar);
    // Molecules
    app.component("UiFormField", UiFormField);
    app.component("UiEmptyState", UiEmptyState);
    app.component("UiModal", UiModal);
    app.component("UiDrawer", UiDrawer);
    app.component("UiToolbar", UiToolbar);
    app.component("UiTabs", UiTabs);
    // Organisms
    app.component("AppHeader", AppHeader);
    app.component("UiDataTable", UiDataTable);
    app.component("RegistrationTimeline", RegistrationTimeline);
  },
};


