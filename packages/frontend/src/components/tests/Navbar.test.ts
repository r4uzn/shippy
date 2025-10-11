import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from '../Navbar.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock a router for the component
const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe('Navbar.vue', () => {
  it('renders the navbar', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router]
      }
    });
    expect(wrapper.find('.navbar').exists()).toBe(true);
    expect(wrapper.text()).toContain('SHIPPY');
  });
});
