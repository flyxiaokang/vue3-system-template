import { onMounted, onUnmounted,  ref } from 'vue';

export const useAutoTableHeight = ({table, offset = 0, minHeight = 300,target=window}) => {
	const tableHeight = ref(0);
	const handler = () => {
		const bounding = table.value.$el?.getBoundingClientRect();
		if (!bounding) return;
		const height = (target.innerHeight??target.offsetHeight) - bounding.top - offset;
		tableHeight.value = height < minHeight ? minHeight : height;
	};
	onMounted(() => {
		handler();
		target.addEventListener('resize', handler);
	});

	onUnmounted(() => {
		target.removeEventListener('resize', handler);
	});

	return { tableHeight };
};