const Announcements = () => {
  const announcements = [
    { id: 1, time: "2:00 PM", message: "Opening ceremony begins" },
    { id: 2, time: "3:00 PM", message: "Hacking starts!" },
    { id: 3, time: "7:00 PM", message: "Dinner served" },
    { id: 4, time: "11:00 PM", message: "Midnight snack" },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <h3 className="text-2xl font-bold text-cyan-300 mb-4">Schedule</h3>
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
            <span className="bg-cyan-500 text-white px-2 py-1 rounded text-sm font-mono">
              {announcement.time}
            </span>
            <span className="text-gray-200">{announcement.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;