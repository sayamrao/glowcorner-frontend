import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useAppStore = defineStore("app", () => {
    // Master data

    const categories = ref([]);
    const brands = ref([]);
    const settings = ref({});
    const banners = ref([]);
    const countries = ref([]);
    const currencies = ref([]);

    // Loading states
    const loadingCategories = ref(false);
    const loadingBrands = ref(false);

    // Getters
    const categoryMap = computed(() =>
        Object.fromEntries(categories.value.map(c => [c.id, c]))
    );

    const brandMap = computed(() =>
        Object.fromEntries(brands.value.map(b => [b.id, b]))
    );

    // Actions

    async function fetchCategories() {
        loadingCategories.value = true;

        try {
            const { data } = await api.get("/categories");
            categories.value = data //["Educational Toys", "Remote Controlled"];
        } finally {
            loadingCategories.value = false;
        }
    }

    // async function fetchBrands() {
    //     loadingBrands.value = true;

    //     try {
    //         const { data } = await api.get("/brands");
    //         brands.value = data;
    //     } finally {
    //         loadingBrands.value = false;
    //     }
    // }
    function setCategories(data) {
        categories.value = data;
    }

    function setBrands(data) {
        brands.value = data;
    }

    function setSettings(data) {
        settings.value = data;
    }

    function reset() {
        categories.value = [];
        brands.value = [];
        settings.value = {};
        banners.value = [];
        countries.value = [];
        currencies.value = [];
    }

    return {
        // state
        categories,
        brands,
        settings,
        banners,
        countries,
        currencies,

        loadingCategories,
        loadingBrands,

        // getters
        categoryMap,
        brandMap,

        // actions
        fetchCategories,
        // fetchBrands,
        setCategories,
        setBrands,
        setSettings,
        reset,
    };
});