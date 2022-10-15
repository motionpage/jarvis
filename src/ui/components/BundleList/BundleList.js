import If from "../utils/condition-component"
import { readableBytes } from "../../helpers/utils"

import "./style.scss"

function ChunkList({ chunks, chunkNames }) {
	return (
		<ul className="chunklist">
			{chunkNames.map((chunk, index) => (
				<If
					key={index}
					condition={chunk.length}
					then={
						<li className="chunk">
							{chunk}
							<span>-</span>
						</li>
					}
					otherwise={null}
				/>
			))}
		</ul>
	)
}

function Asset({ bundle: { name, chunks, size, isOverSizeLimit, chunkNames } }) {
	return (
		<li className="bundles">
			<span>{name}</span>
			<p className="details">
				<span>
					{chunks.length} chunks, {readableBytes(size)}
				</span>
				<If
					condition={isOverSizeLimit}
					then={<span className="size big">big</span>}
					otherwise={<span className="size ok">ok</span>}
				/>
			</p>
			<ChunkList chunks={chunks} chunkNames={chunkNames} />
		</li>
	)
}

export default function BundleList({ assets }) {
	return (
		<div className="bundle-list">
			<ul className="card">
				{assets.map((bundle) => (
					<Asset key={bundle.name} bundle={bundle} />
				))}
			</ul>
		</div>
	)
}
