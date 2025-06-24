// src/components/PokemonSelect.tsx
import React, { useState } from "react";
import { Pokedex } from "../../../../data/pokedex";

type PokemonKey = keyof typeof Pokedex;

interface PokemonSelectProps {
	onSelect?: (pokemonKey: PokemonKey) => void;
}

export const PokemonSelect: React.FC<PokemonSelectProps> = ({ onSelect }) => {
	const [selected, setSelected] = useState<PokemonKey | "">("");
	// force the right tuple types
	const entries = Object.entries(Pokedex) as [
		PokemonKey,
		(typeof Pokedex)[PokemonKey]
	][];
	entries.sort(([, a], [, b]) => a.num - b.num);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const key = e.target.value as PokemonKey;
		setSelected(key);
		onSelect?.(key);
	};

	return (
		<select value={selected} onChange={handleChange}>
			<option value="" disabled>
				— Select a Pokémon —
			</option>
			{entries.map(([key, { name }]) => (
				<option key={key} value={key}>
					{name}
				</option>
			))}
		</select>
	);
};
