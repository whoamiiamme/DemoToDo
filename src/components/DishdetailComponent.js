import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';

function RenderDish({ dish }) {
	return (
		<div className='col-sm-12 col-md-5 m-1'>
			<Card>
				<CardImg top src={dish.image} alt={dish.name} />
				<CardBody>
					<CardTitle>{dish.name}</CardTitle>
					<CardText>{dish.description}</CardText>
				</CardBody>
			</Card>
		</div>
	);
}

function RenderComments({ comments }) {
	if (comments != null)
		return (
			<div className='col-sm-12 col-md-5 m-1'>
				<h4>Comments</h4>
				{comments.map((comment) => {
					return (
						<ul key={comment.id} className='list-unstyled'>
							<li className='media mb-2'>{comment.comment}</li>
							<li className='media mb-2'>
								--{' '}
								{`${comment.author}, ${new Intl.DateTimeFormat('en-US', {
									year: 'numeric',
									month: 'short',
									day: '2-digit'
								}).format(new Date(Date.parse(comment.date)))}`}
							</li>
						</ul>
					);
				})}
				<ul />
			</div>
		);
	else return <div />;
}

const DishDetail = (props) => {
	if (props.dish != null)
		return (
			<div className='container'>
				<div className='row'>
					<RenderDish dish={props.dish} />
					<RenderComments comments={props.dish.comments} />
				</div>
			</div>
		);
	else return <div />;
};

export default DishDetail;
