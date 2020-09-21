import React, { Component } from 'react';
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Row,
	Col,
	Label,
	Modal,
	ModalHeader,
	ModalBody
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

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

function RenderComments({ comments, addComment, dishId }) {
	if (comments != null)
		return (
			<div className='col-sm-12 col-md-5 m-1'>
				<h4>Comments</h4>
				<ul className='list-unstyled'>
					{comments.map((comment) => {
						return (
							<li key={comment.id}>
								<p>{comment.comment}</p>
								<p>
									--{' '}
									{`${comment.author}, ${new Intl.DateTimeFormat('en-US', {
										year: 'numeric',
										month: 'short',
										day: '2-digit'
									}).format(new Date(Date.parse(comment.date)))}`}
								</p>
							</li>
						);
					})}
				</ul>

				<CommentForm dishId={dishId} addComment={addComment} />
			</div>
		);
	else return <div />;
}

class CommentForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
	}

	handleSubmit(values) {
		this.toggleModal();
		this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	render() {
		return (
			<div>
				<Button outline color='secondary' onClick={this.toggleModal}>
					<span className='fa fa-pencil' aria-hidden='true' /> Submit Comment
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className='form-grounp'>
								<Label htmlFor='rating' xs={12}>
									Rating
								</Label>
								<Col xs={12}>
									<Control.select
										model='.rating'
										name='rating'
										className='form-control custom-select'
									>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Control.select>
								</Col>
							</Row>
							<Row className='form-grounp'>
								<Label htmlFor='author' xs={12}>
									Your Name
								</Label>
								<Col xs={12}>
									<Control.text
										model='.author'
										id='author'
										name='author'
										className='form-control'
										placeholder='Your Name'
										validators={{
											required,
											minLength: minLength(3),
											maxLength: maxLength(15)
										}}
									/>
									<Errors
										className='text-danger'
										model='.author'
										show='touched'
										messages={{
											required: 'Required',
											minLength: 'Must be greater than 2 characters',
											maxLength: 'Must be 15 characters or less'
										}}
									/>
								</Col>
							</Row>
							<Row className='form-grounp'>
								<Label htmlFor='comment' xs={12}>
									Comment
								</Label>
								<Col xs={12}>
									<Control.textarea
										model='.comment'
										id='comment'
										name='comment'
										className='form-control'
										rows='6'
									/>
								</Col>
							</Row>
							<Row className='form-group'>
								<Col xs={12}>
									<Button type='submit' color='primary'>
										Submit
									</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

const DishDetail = (props) => {
	if (props.isLoading) {
		return (
			<div className='container'>
				<div className='row'>
					<Loading />
				</div>
			</div>
		);
	} else if (props.errMess) {
		return (
			<div className='container'>
				<div className='row'>
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	} else if (props.dish != null)
		return (
			<div className='container'>
				<div className='row'>
					<Breadcrumb>
						<BreadcrumbItem>
							<Link to='/menu'>Menu</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className='col-12'>
						<h3>{props.dish.name}</h3>
						<hr />
					</div>
				</div>
				<div className='row'>
					<RenderDish dish={props.dish} />
					<RenderComments comments={props.comments} addComment={props.addComment} dishId={props.dish.id} />
				</div>
			</div>
		);
	else return <div />;
};

export default DishDetail;
