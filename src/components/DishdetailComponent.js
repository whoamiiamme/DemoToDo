import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';

class DishDetail extends Component {
	renderDish(dish) {
		if (dish != null)
			return (
				<Card>
					<CardImg top src={dish.image} alt={dish.name} />
					<CardBody>
						<CardTitle>{dish.name}</CardTitle>
						<CardText>{dish.description}</CardText>
					</CardBody>
				</Card>
			);
		else return <div />;
	}

	renderComments(comments) {
		if (comments != null) {
			return (
				<div>
					<h4>Comments</h4>
					{comments.comments.map((element) => {
						return (
							<ul key={element.id} className='list-unstyled'>
								<li className='media mb-2'>{element.comment}</li>
								<li className='media mb-2'>
									--{' '}
									{`${element.author}, ${new Intl.DateTimeFormat('en-US', {
										year: 'numeric',
										month: 'short',
										day: '2-digit'
									}).format(new Date(Date.parse(element.date)))}`}
								</li>
							</ul>
						);
					})}
					<ul />
				</div>
			);
		} else return <div />;
	}

	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-sm-12 col-md-5 m-1'>{this.renderDish(this.props.dish)}</div>
					<div className='col-sm-12 col-md-5 m-1'>{this.renderComments(this.props.dish)}</div>
				</div>
			</div>
		);
	}
}

export default DishDetail;
