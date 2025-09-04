import React from "react";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import type { Entry } from "@/types";

export default function EntryList({
  entries,
  onPick,
}: {
  entries: Entry[];
  onPick: (e: Entry) => void;
}) {
  return (
    <List>
      {entries.map((e) => (
        <ListItem
          key={e.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => onPick(e)} aria-label="edit">
              <EditNoteRoundedIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>{e.mood ?? "📓"}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={e.title || "Untitled"}
            secondary={`${e.date} • ${e.content.slice(0, 80)}${e.content.length > 80 ? "…" : ""}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
