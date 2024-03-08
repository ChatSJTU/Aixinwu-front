import React from 'react';
import { Row, Col } from 'antd';
import { ProductPreviewCard } from './product-preview-card';
import { ProductSummary } from "@/models/products";

const ProductGrid: React.FC<{ products: ProductSummary[], rowNum?: number }> = ({ rowNum = 2, products }) => {
	const getColSpan = () => {
		const xs = 12; // mobile
		const sm = 12; // small screens
		const md = 8;  // medium screens
		const lg = 6;  // large screens
		const xl = 6;  // large screens
		return { xs, sm, md, lg, xl };
	};

	return (
		<div className='product-grid-container' style={{maxHeight: `calc(${rowNum} * (280px + 16px))`}}>
			<Row gutter={[16, 16]}>
				{products.map((product: ProductSummary) => (
					<Col {...getColSpan()} key={product.product_id}>
						<ProductPreviewCard productSummary={product} />
					</Col>
				))}
			</Row>
		</div>
	);
};

export default ProductGrid;