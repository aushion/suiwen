function Result(props){
  const question = props.location.query.question;
  return <div>{question}</div>
}

export default Result