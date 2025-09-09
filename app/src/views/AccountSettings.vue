<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/account.store'
const account = useAccountStore()
onMounted(()=> account.fetch())

const firstName = ref('')
const lastName = ref('')
const pronouns = ref('')
const username = ref('')
const email = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const newPassword2 = ref('')
const twoFA = ref(false)
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | undefined>(undefined)

onMounted(()=>{
  if (account.item) {
    firstName.value = account.item.firstName
    lastName.value = account.item.lastName
    pronouns.value = account.item.pronouns || ''
    username.value = account.item.username
    email.value = account.item.email
    twoFA.value = account.item.twoFactorEnabled
    avatarPreview.value = account.item.avatarDataUrl
  }
})

async function savePersonal(){
  await account.updateProfile({ firstName: firstName.value.trim(), lastName: lastName.value.trim(), pronouns: pronouns.value.trim() || undefined })
}
async function saveAccount(){
  await account.updateAccount({ username: username.value.trim(), email: email.value.trim() }, currentPassword.value)
}
async function saveSecurity(){
  if (newPassword.value || newPassword2.value) {
    if (newPassword.value.length < 8 || newPassword.value !== newPassword2.value) {
      alert('Password must be at least 8 characters and match confirmation'); return
    }
    await account.changePassword(currentPassword.value, newPassword.value)
  }
  await account.setTwoFactor(twoFA.value)
}
function onAvatarChange(e: Event){
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!/^image\/(png|jpe?g)$/i.test(file.type) || file.size > 2*1024*1024){ alert('Use PNG/JPG up to 2MB'); return }
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = () => avatarPreview.value = String(reader.result)
  reader.readAsDataURL(file)
}
async function saveAvatar(){ await account.updateAvatar(avatarPreview.value) }
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="User Settings" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section class="bg-white rounded border p-4 space-y-3">
        <h3 class="text-sm font-semibold">Personal Information</h3>
        <UiFormField label="First Name">
          <UiInput v-model="firstName" />
        </UiFormField>
        <UiFormField label="Last Name">
          <UiInput v-model="lastName" />
        </UiFormField>
        <UiFormField label="Pronouns">
          <UiInput v-model="pronouns" placeholder="e.g., she/her" />
        </UiFormField>
        <UiButton @click="savePersonal">Save</UiButton>
      </section>

      <section id="avatar" class="bg-white rounded border p-4 space-y-3">
        <h3 class="text-sm font-semibold">Profile Photo</h3>
        <div class="flex items-center gap-3">
          <UiAvatar :src="avatarPreview" :size="64" />
          <input type="file" accept="image/png,image/jpeg" @change="onAvatarChange" />
        </div>
        <UiButton @click="saveAvatar">Save Photo</UiButton>
      </section>

      <section class="bg-white rounded border p-4 space-y-3">
        <h3 class="text-sm font-semibold">Account Information</h3>
        <UiFormField label="Username">
          <UiInput v-model="username" />
        </UiFormField>
        <UiFormField label="Email">
          <UiInput v-model="email" type="email" />
        </UiFormField>
        <UiFormField label="Current Password">
          <UiInput v-model="currentPassword" type="password" placeholder="Required for changes" />
        </UiFormField>
        <UiButton @click="saveAccount">Save</UiButton>
      </section>

      <section id="security" class="bg-white rounded border p-4 space-y-3">
        <h3 class="text-sm font-semibold">Security</h3>
        <label class="flex items-center gap-2 text-sm">
          <UiCheckbox v-model="twoFA" /> Enable Two-Factor Authentication
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <UiFormField label="Current Password">
            <UiInput v-model="currentPassword" type="password" />
          </UiFormField>
          <UiFormField label="New Password">
            <UiInput v-model="newPassword" type="password" />
          </UiFormField>
          <UiFormField label="Confirm New Password">
            <UiInput v-model="newPassword2" type="password" />
          </UiFormField>
        </div>
        <UiButton @click="saveSecurity">Update Security</UiButton>
      </section>
    </div>
  </div>
</template>

<style scoped>
</style>


