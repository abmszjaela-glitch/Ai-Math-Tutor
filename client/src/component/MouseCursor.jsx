const MouseCursor = () => {
  return (
    <>
      <div
        className="mouseCursor cursor-outer"
        style={{
          visibility: 'visible',
        }}
      ></div>

      <div
        className="mouseCursor cursor-inner"
        style={{
          visibility: 'visible',
        }}
      ></div>
    </>
  );
};

export default MouseCursor;