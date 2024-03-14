import React from 'react';
import { Row, Col, Empty } from 'antd';
import { ProductPreviewCard } from './product-preview-card';
import { ProductSummary } from "@/models/products";

const ProductGrid: React.FC<{ products: ProductSummary[], rowNum?: number }> = ({ rowNum = 2, products }) => {
	const getColSpan = () => {
		const xs = 12; // 576- px
		const sm = 12; // 576+ px
		const md = 8;  // 768+ px
		const lg = 6;  // 992+ px
		const xl = 6;  // 1200+ px
		const xxl = 4; // (非默认值) 2400+ px
		return { xs, sm, md, lg, xl, xxl };
	};

    if (products.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

	return (
		<div className='product-grid-container' style={{maxHeight: `calc(${rowNum} * (265px + 16px))`}}>
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