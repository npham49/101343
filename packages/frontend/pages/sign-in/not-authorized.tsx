const notAuthorized = () => {
  return (
    <div>
      <h1>Not Authorized</h1>
      <p>
        You must be signed in to view this page.{" "}
        <a href="/sign-in">Sign in here</a>.
      </p>
    </div>
  );
};

export default notAuthorized;
