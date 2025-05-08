const Error = ({ error }: { error: string }) => {
  return (
    <div className="p-2 px-3 bg-destructive/10 text-sm text-destructive rounded-md border border-destructive/20 flex gap-2">
      <p>{error}</p>
    </div>
  );
};

export default Error;
