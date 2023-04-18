namespace Nova_DMS.Models
{
    public class Node
    {
        public string Id { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string HID { get; set; } = null!;

        public Metadata Metadata { get; set; } = null!;
    }
}
