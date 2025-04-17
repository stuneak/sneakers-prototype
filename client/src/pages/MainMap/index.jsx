import React, { useState, useEffect } from 'react';
import {
	Grid,
	Card,
	Text,
	Image,
	Pagination,
	Group,
	Select,
	MultiSelect,
	TextInput,
	Title,
	Paper,
	Stack,
	RangeSlider,
	Divider,
	Badge,
	Checkbox,
	Button,
	ActionIcon,
	useMantineColorScheme,
	Tooltip,
	useComputedColorScheme
} from '@mantine/core';
import { IconSearch, IconArrowRight, IconSelectAll, IconSun, IconMoon } from '@tabler/icons-react';
import entity from '../../entity';
import { Canvas } from '../../components/Canvas';

export function MainMap() {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme('light', {
		getInitialValueInEffect: true,
	});

	// const { colorScheme, setColorScheme } = useMantineColorScheme();
	// const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

	const { getSneakers } = entity.user;
	const { sneakers: sneakersState } = entity.user.useUserStore((state) => state);

	const sneakers = sneakersState.data;
	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filter states
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedBrand, setSelectedBrand] = useState('');
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [priceRange, setPriceRange] = useState([0, 1000]);

	// Canvas states
	const [selectedSneakers, setSelectedSneakers] = useState([]);
	const [showCanvas, setShowCanvas] = useState(false);

	// Calculate max price for the slider
	const maxPrice = React.useMemo(() => {
		const prices = sneakers?.map(item => item.max_price) || [];
		return Math.max(...prices, 500);
	}, [sneakers]);

	// Derived data for filters
	const brands = React.useMemo(() => {
		const brandSet = new Set(sneakers?.map(item => item.brand) || []);
		return Array.from(brandSet).filter(Boolean);
	}, [sneakers]);

	const categories = React.useMemo(() => {
		const categorySet = new Set(sneakers?.map(item => item.category) || []);
		return Array.from(categorySet).filter(Boolean);
	}, [sneakers]);

	// Filtered data
	const filteredSneakers = React.useMemo(() => {
		if (!sneakers) return [];

		return sneakers.filter(sneaker => {
			// Text search
			const matchesSearch = searchQuery === '' ||
				sneaker.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				sneaker.model?.toLowerCase().includes(searchQuery.toLowerCase());

			// Brand filter
			const matchesBrand = selectedBrand === '' || sneaker.brand === selectedBrand;

			// Categories filter
			const matchesCategory = selectedCategories.length === 0 ||
				(sneaker.category && selectedCategories.includes(sneaker.category));

			// Price filter
			const price = sneaker.avg_price || sneaker.min_price;
			const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

			return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
		});
	}, [sneakers, searchQuery, selectedBrand, selectedCategories, priceRange]);

	// Paginated data
	const paginatedSneakers = React.useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredSneakers.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredSneakers, currentPage]);

	// Total pages
	const totalPages = Math.ceil((filteredSneakers?.length || 0) / itemsPerPage);

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedBrand, selectedCategories, priceRange]);

	useEffect(() => {
		getSneakers();
	}, []);

	// Handler for selecting a sneaker
	const handleSelectSneaker = (sneaker) => {
		setSelectedSneakers(prev => {
			const isSelected = prev.some(item => item.id === sneaker.id);
			if (isSelected) {
				return prev.filter(item => item.id !== sneaker.id);
			}
			return [...prev, sneaker];

		});
	};

	// Handler for removing a sneaker from canvas
	const handleRemoveSneaker = (sneakerId) => {
		setSelectedSneakers(prev => prev.filter(item => item.id !== sneakerId));
	};

	// Handler for selecting all visible sneakers
	const handleSelectAll = () => {
		const currentIds = selectedSneakers.map(s => s.id);
		const newSelected = [...selectedSneakers];

		paginatedSneakers.forEach(sneaker => {
			if (!currentIds.includes(sneaker.id)) {
				newSelected.push(sneaker);
			}
		});

		setSelectedSneakers(newSelected);
	};

	// Handler for deselecting all sneakers
	const handleDeselectAll = () => {
		setSelectedSneakers([]);
	};

	// If canvas is shown, render the Canvas component
	if (showCanvas) {
		return (
			<Canvas
				selectedSneakers={selectedSneakers}
				onRemoveSneaker={handleRemoveSneaker}
				onClose={() => setShowCanvas(false)}
			/>
		);
	}

	return (
		<div className="p-6">
			<Group position="apart" mb="md">
				<Group>
					<Title order={2}>Product name</Title>
					<Tooltip label="Change theme">
						<ActionIcon
							onClick={() =>
								setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
							}
							variant="default"
							size="lg"
							aria-label="Toggle color scheme"
						>

							<IconSun size={18} className="light" />
							<IconMoon size={18} className="dark" />
						</ActionIcon>
					</Tooltip>
				</Group>

				{selectedSneakers.length > 0 && (
					<Group>
						<Text size="sm">
							{selectedSneakers.length} sneaker{selectedSneakers.length !== 1 ? 's' : ''} selected
						</Text>
						<Button
							rightIcon={<IconArrowRight size={16} />}
							onClick={() => setShowCanvas(true)}
						>
							View on Canvas
						</Button>
					</Group>
				)}
			</Group>

			<Grid>
				{/* Filters - Left Side */}
				<Grid.Col span={{ base: 12, md: 3 }}>
					<Paper p="md" shadow="xs" className="sticky top-6">
						<Stack spacing="md">
							<Title order={4}>Filters</Title>

							<TextInput
								placeholder="Search sneakers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								leftSection={<IconSearch size={16} />}
							/>

							<Select
								label="Brand"
								placeholder="Select brands"
								data={brands.map(brand => ({ value: brand, label: brand }))}
								value={selectedBrand}
								onChange={(item) => {
									if (item) {
										setSelectedBrand(item);
									} else {
										setSelectedBrand('');
									}
								}}
								clearable
							/>

							<MultiSelect
								label="Categories"
								placeholder="Select categories"
								data={categories.map(category => ({ value: category, label: category }))}
								value={selectedCategories}
								onChange={setSelectedCategories}
								clearable
							/>

							<div>
								<Text size="sm" mb={8}>Price Range</Text>
								<RangeSlider
									min={0}
									max={maxPrice}
									value={priceRange}
									onChange={setPriceRange}
									labelAlwaysOn
									minRange={20}
								/>
							</div>

							<Divider />

							<Group position="apart">
								<Text size="sm" color="dimmed">
									Showing {filteredSneakers.length} items
								</Text>

								{paginatedSneakers.length > 0 && (
									<ActionIcon
										variant="subtle"
										color="blue"
										title="Select all on this page"
										onClick={handleSelectAll}
									>
										<IconSelectAll size={18} />
									</ActionIcon>
								)}
							</Group>

							{selectedSneakers.length > 0 && (
								<Button
									variant="subtle"
									color="red"
									onClick={handleDeselectAll}
									compact
								>
									Clear selection ({selectedSneakers.length})
								</Button>
							)}
						</Stack>
					</Paper>
				</Grid.Col>

				{/* Sneaker Grid - Right Side */}
				<Grid.Col span={{ base: 12, md: 9 }}>
					{/* Sneaker Cards */}
					<Grid>
						{paginatedSneakers.length > 0 ? (
							paginatedSneakers.map((sneaker) => (
								<Grid.Col key={sneaker.id} span={{ base: 12, xs: 6, sm: 4, md: 6, lg: 4 }}>
									<Card shadow="sm" p="md" radius="md" withBorder className="h-full relative">
										<Card.Section>
											<Image
												src={sneaker.image}
												height={200}
												alt={sneaker.title}
												fit="contain"
												className="bg-gray-50"
											/>
										</Card.Section>

										<Stack spacing="xs" mt="md">
											<Text fw={500} size="lg" lineClamp={1}>{sneaker.title}</Text>
											<Text fw={500} size="sm" color="dimmed" lineClamp={1}>{sneaker.model}</Text>

											<Group gap="xs">
												<Badge color="blue">{sneaker.category}</Badge>
												{sneaker.secondary_category && (
													<Badge color="gray">{sneaker.secondary_category}</Badge>
												)}
											</Group>

											<Text fw={700} size="lg" c="blue">
												${sneaker.avg_price ? sneaker.avg_price.toFixed(2) : sneaker.min_price}
											</Text>

											<Group position="right" mt="xs">
												<Checkbox
													checked={selectedSneakers.some(item => item.id === sneaker.id)}
													onChange={() => handleSelectSneaker(sneaker)}
													label="Select"
													size="md"
												/>
											</Group>
										</Stack>
									</Card>
								</Grid.Col>
							))
						) : (
							<Grid.Col span={12}>
								<Paper p="xl" radius="md" className="text-center">
									<Text fw={500} size="lg">No sneakers found matching your criteria</Text>
								</Paper>
							</Grid.Col>
						)}
					</Grid>

					{/* Pagination */}
					{filteredSneakers.length > 0 && (
						<Group position="center" mt="xl">
							<Pagination
								total={totalPages}
								value={currentPage}
								onChange={setCurrentPage}
								withEdges
							/>
						</Group>
					)}
				</Grid.Col>
			</Grid>
		</div>
	);
}
