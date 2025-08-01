export const MannerLevelCell = ({ mannerLevel }: { mannerLevel?: number }) => (
  <div className="table_width">
    {mannerLevel && (
      <p className="text-violet-600 font-bold text-base">LV.{mannerLevel}</p>
    )}
  </div>
);
