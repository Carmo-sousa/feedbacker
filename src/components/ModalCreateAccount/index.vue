<template>
  <div class="flex justify-between">
    <h1 class="text-4xl font-black text-gray-800">Crie uma conta</h1>
    <button
    @click="close"
    class="text-4xl text-gray-600 focus:outline-none"
    >&times;</button>
  </div>

  <div class="mt-16">
    <form @submit.prevent="handlerSubmit">
      <!-- Nome -->
      <label class="block">
        <span class="text-lg font-medium text-gray-800">Nome</span>
        <input
        v-model="state.name.value"
        type="text"
        :class="{
          'border-brand-danger': !!state.name.errorMessage
        }"
        class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded
        focus:outline-none"
        placeholder="Joe Jone"
        >
        <span
        v-if="!!state.name.errorMessage"
        class="block font-medium text-brand-danger">
        {{ state.name.errorMessage }}</span>
      </label>
      <!-- Fim: Nome -->

      <!-- E-mail -->
      <label class="block mt-10">
        <span class="text-lg font-medium text-gray-800">E-mail</span>
        <input
        v-model="state.email.value"
        type="email"
        :class="{
          'border-brand-danger': !!state.email.errorMessage
        }"
        class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded
        focus:outline-none"
        placeholder="joe.jone@gmail.com"
        >
        <span
        v-if="!!state.email.errorMessage"
        class="block font-medium text-brand-danger">
        {{ state.email.errorMessage }}</span>
      </label>
      <!-- Fim: E-mail -->

      <!-- Password -->
      <label class="block mt-10">
        <span class="text-lg font-medium text-gray-800">Senha</span>
        <input
        v-model="state.password.value"
        type="password"
        :class="{
          'border-brand-danger': !!state.password.errorMessage
        }"
        class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded
        focus:outline-none"
        placeholder="****"
        >
        <span
        v-if="!!state.password.errorMessage"
        class="block font-medium text-brand-danger">
        {{ state.password.errorMessage }}</span>
      </label>
      <!-- Fim: Password -->
      <button
      :disabled="state.isLoading"
      type="submit"
      :class="{
        'opacity-50': state.isLoading
      }"
      class="px-8 py-3 mt-10 text2xl font-bold text-white rounded-full
      bg-brand-main focus:outline-none transition-all duration-150"
      >
      <icon v-if="state.isLoading" name="loading" class="animate-spin"/>
      <span v-else>Criar conta</span>
      </button>
    </form>
  </div>
</template>

<script>

import { reactive } from 'vue';
import { useField } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import services from '../../services';
import Icon from '../Icon/index.vue';
import useModal from '../../hooks/useModal';
import { validateEmptyAndLength3, validateEmptyAndEmail } from '../../utils/validators';

export default {
  components: { Icon },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const modal = useModal();

    const {
      value: nameValue,
      errorMessage: nameErrorMessage,
    } = useField('name', validateEmptyAndLength3);

    const {
      value: emailValue,
      errorMessage: emailErrorMessage,
    } = useField('email', validateEmptyAndEmail);

    const {
      value: passwordValue,
      errorMessage: passwordErrorMessage,
    } = useField('password', validateEmptyAndLength3);

    const state = reactive({
      hasError: false,
      isLoading: false,
      name: {
        value: nameValue,
        errorMessage: nameErrorMessage,
      },
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage,
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage,
      },
    });

    async function login({ email, password }) {
      const { errors } = await services.auth.login({ email, password });

      if (!errors) {
        router.push({ name: 'Feedbacks' });
        modal.close();
      }
      state.isloading = false;
    }

    async function handlerSubmit() {
      // TODO: Refatorar função para criar um novo usuário
      try {
        toast.clear();
        state.isLoading = true;
        const { errors } = await services.auth.register({
          name: state.name.value,
          email: state.email.value,
          password: state.password.value,
        });

        if (!errors) {
          await login({
            email: state.email.value,
            password: state.password.value,
          });
          return;
        }

        if (errors.status === 400) {
          toast.error('Ocorreu um erro ao criar a conta!');
        }

        state.isLoading = false;
      } catch (error) {
        state.isLoading = false;
        state.hasError = !!error;
        console.log(error);
        toast.error('Ocorreu um erro ao criar a conta!');
      }
    }

    return {
      state,
      close: modal.close,
      handlerSubmit,
    };
  },
};
</script>
